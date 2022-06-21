package services

import (
	"crypto/rsa"
	"crypto/x509"
	"encoding/base64"
	"encoding/json"
	"encoding/pem"
	"fmt"
	"github.com/divoc/registration-api/config"
	"github.com/divoc/registration-api/pkg/utils"
	"github.com/gospotcheck/jwt-go"
	"github.com/imroc/req"
	"github.com/lestrrat-go/jwx/jwa"
	"github.com/lestrrat-go/jwx/jws"
	"github.com/pkg/errors"
	log "github.com/sirupsen/logrus"
	"strconv"
	"strings"
	"time"
)

type OTPRequest struct {
	Id               string   `json:"id"`
	Version          string   `json:"version"`
	TransactionId    string   `json:"transactionID"`
	RequestTime      string   `json:"requestTime"`
	IndividualId     string   `json:"individualId"`
	IndividualIdType string   `json:"individualIdType"`
	OtpChannel       []string `json:"otpChannel"`
}

type RequestHeader struct {
	Signature     string `json:"signature"`
	ContentType   string `json:"Content-type"`
	Authorisation string `json:"Authorization"`
}

type AuthRequest struct {
	Id               string   `json:"id"`
	Version          string   `json:"version"`
	RequestedAuth          map[string]bool   `json:"requestedAuth"`
	TransactionId    string   `json:"transactionID"`
	RequestTime      string   `json:"requestTime"`
	Request      string   `json:"request"`
	ConsentObtained      bool   `json:"consentObtained"`
	IndividualId     string   `json:"individualId"`
	IndividualIdType string   `json:"individualIdType"`
	RequestHMAC string   `json:"requestHMAC"`
	Thumbprint string   `json:"thumbprint"`
	RequestSessionKey       string `json:"requestSessionKey"`
}

type MosipResponse struct {
	ID            string                   `json:"id"`
	Version       string	 			   `json:"version"`
	ResponseTime  string                   `json:"responseTime"`
	TransactionID string                   `json:"transactionID"`
	Response      map[string]interface{}   `json:"response"`
	Errors        []struct{
		ErrorCode   string `json:"errorCode"`
		ErrorMessage   string `json:"errorMessage"`
		ActionMessage string `json:"actionMessage"`
	}`json:"errors"`
}

func MosipOTPRequest(individualIDType string, individualId string) (map[string]interface{}, error) {

	authToken := getMosipAuthToken()
	requestBody := OTPRequest{
		Id:               "mosip.identity.otp",
		Version:          "1.0",
		TransactionId:    "1234567890",
		RequestTime:      time.Now().UTC().Format("2006-01-02T15:04:05.999Z"),
		IndividualId:     individualId,
		IndividualIdType: individualIDType,
		OtpChannel:       []string{"email"},
	}

	reqJson, err :=json.Marshal(requestBody)
	if err != nil {
		log.Errorf("Error occurred while trying to marshal the requestBody(%v)", err)
		return nil, err
	}
	log.Infof("requestBody before signature - %s", reqJson)
	signedPayload := getSignature(reqJson, config.Config.Mosip.PrivateKey, config.Config.Mosip.PublicKey)
	log.Debugf("signed payload - %v", signedPayload)

	resp, err := generateOTP(requestBody, RequestHeader{
		Signature:   signedPayload,
		ContentType: "application/json",
		Authorisation: "Authorization="+authToken,
	});

	if err != nil {
		log.Errorf("Error Response from MOSIP OTP Generate API - %v", err)
		return nil, err
	}

	log.Debugf("Response of OTP request - %V", resp)

	return analyseResponse(resp, err)
}

func analyseResponse(response *req.Resp, err error) (map[string]interface{}, error) {
	if err != nil {
		return nil, errors.Errorf("Error while requesting MOSIP %v", err)
	}
	if response.Response().StatusCode != 200 {
		return nil, errors.New("Request failed with " + strconv.Itoa(response.Response().StatusCode))
	}
	responseObject := MosipResponse{}
	err = response.ToJSON(&responseObject)
	if err != nil {
		return nil, errors.Wrap(err, "Unable to parse response from MOSIP.")
	}
	log.Debugf("Response %+v", responseObject)
	if len(responseObject.Errors) > 0 {
		log.Errorf("Response from MOSIP %+v", responseObject)
		var errorMsgs []string
		for _, err := range responseObject.Errors {
			errorMsgs = append(errorMsgs, err.ErrorMessage)
		}
		return nil, errors.New(strings.Join(errorMsgs, ","))
	}
	return responseObject.Response, nil
}

func MosipAuthRequest(individualIDType string, individualId string, otp string, isKycRequired bool) (map[string]interface{}, error) {

	requestTime := time.Now().UTC().Format("2006-01-02T15:04:05.999Z")
	identityBlock, _ := json.Marshal(map[string] string {
		"timestamp": requestTime,
		"otp": otp,
	})
	secretKey := utils.GenSecKey()
	encryptedIdentityBlock := utils.SymmetricEncrypt(identityBlock, secretKey)
	block, _ := pem.Decode([]byte(config.Config.Mosip.IDACertKey))

	var cert* x509.Certificate
	cert, _ = x509.ParseCertificate(block.Bytes)
	rsaPublicKey := cert.PublicKey.(*rsa.PublicKey)
	encryptedSessionKeyByte, err := utils.AsymmetricEncrypt(secretKey, rsaPublicKey)
	if err != nil {
		return nil, err
	}
	RequestHMAC := utils.SymmetricEncrypt([]byte(utils.DigestAsPlainText(identityBlock)), secretKey)

	pemBlock, _ := pem.Decode([]byte(config.Config.Mosip.IDACertKey))
	certificateThumbnail := utils.Sha256Hash(pemBlock.Bytes)

	id := "mosip.identity.auth"
	if isKycRequired {
		id = "mosip.identity.kyc"
	}

	authBody := AuthRequest{
		Id:               id,
		Version:           "1.0",
		RequestedAuth: 		map[string]bool{"otp": true},
		TransactionId:     "1234567890",
		RequestTime:       requestTime,
		Request:           base64.URLEncoding.EncodeToString([]byte(encryptedIdentityBlock)),
		ConsentObtained:   true,
		IndividualId:      individualId,
		IndividualIdType:  individualIDType,
		RequestHMAC:       base64.URLEncoding.EncodeToString([]byte(RequestHMAC)),
		Thumbprint:        base64.URLEncoding.EncodeToString(certificateThumbnail),
		RequestSessionKey: base64.URLEncoding.EncodeToString(encryptedSessionKeyByte),
	}

	reqJson, err :=json.Marshal(authBody)
	if err != nil {
		log.Errorf("Error occurred while trying to marshal authBody (%v)", err)
		return nil, err
	}
	log.Debugf("requestBody before signature - %s", reqJson)

	signedPayload := getSignature(reqJson, config.Config.Mosip.PrivateKey, config.Config.Mosip.PublicKey)
	log.Debugf("signed payload - %v", signedPayload)

	authToken := getMosipAuthToken()

	var resp *req.Resp
	if isKycRequired {
		resp, err = requestKyc(authBody, RequestHeader{
			Signature:   signedPayload,
			ContentType: "application/json",
			Authorisation: "Authorization="+authToken,
		})
	} else {
		resp, err = requestAuth(authBody, RequestHeader{
			Signature:   signedPayload,
			ContentType: "application/json",
			Authorisation: "Authorization="+authToken,
		})
	}

	if err != nil {
		log.Errorf("HTTP call to MOSIP Auth API failed - %v", err)
		return nil, err
	}

	log.Debugf("Response of Auth request - %V", resp)

	result, err := analyseResponse(resp, err)
	if err != nil {
		return nil, err
	}

	if isKycRequired {
		status := result["kycStatus"].(bool)
		if !status {
			return nil, errors.New("KYC request failed!")
		}

		responseMap, err := formatEKycResponse(result)

		result["identity"], err = decrypt(responseMap["identity"].(string), responseMap["sessionKey"].(string))
		if err != nil {
			return nil, err
		}
	}

	return result, err
}

func decrypt(data string, sessionKey string) (map[string]interface{}, error) {
	encKey, _ := base64.URLEncoding.DecodeString(sessionKey)
	key, err := utils.AsymmetricDecrypt(encKey, config.Config.Mosip.PrivateKey)
	if err != nil {
		log.Errorf("error while decrypting key %v", err)
	}

	encIdentity, err := base64.URLEncoding.DecodeString(data)
	if err != nil {
		return nil, err
	}

	identityString := utils.SymmetricDecrypt(string(encIdentity), []byte(key))

	var identity map[string]interface{}
	err =json.Unmarshal([]byte(identityString), &identity)
	if err != nil {
		log.Errorf("Error during unmarshal of identity %v", err)
		return nil, err
	}

	return identity, nil
}

func formatEKycResponse(response map[string]interface{}) (map[string]interface{}, error) {
	decoded, err := base64.RawURLEncoding.DecodeString(response["identity"].(string))
	if err != nil {
		log.Errorf("Error while decoding base64 string %v", err)
		return nil, err
	}

	separator := "#KEY_SPLITTER#"

	// split the decoded string to get sessionKey and encrypted response
	ret := strings.Split(string(decoded), separator)
	response["sessionKey"] = base64.URLEncoding.EncodeToString([]byte(ret[0]))
	response["identity"] = base64.URLEncoding.EncodeToString([]byte(ret[1]))

	return response, nil
}

func generateOTP(requestBody OTPRequest, header RequestHeader) (*req.Resp, error) {
	return req.Post(config.Config.Mosip.OTPUrl, req.BodyJSON(requestBody), req.HeaderFromStruct(header))
}

func requestAuth(requestBody AuthRequest, header RequestHeader) (*req.Resp, error) {
	return req.Post(config.Config.Mosip.AuthUrl, req.BodyJSON(requestBody), req.HeaderFromStruct(header))
}

func requestKyc(requestBody AuthRequest, header RequestHeader) (*req.Resp, error) {
	return req.Post(config.Config.Mosip.KycUrl, req.BodyJSON(requestBody), req.HeaderFromStruct(header))
}

func getMosipAuthToken() string {
	// TODO: Generate the token from API
	return config.Config.Mosip.AuthHeader
}

func getSignature(data []byte, privateKey string, certificate string) string {

	keyFromPem, _ := jwt.ParseRSAPrivateKeyFromPEM([]byte(privateKey))

	pemBlock, _ := pem.Decode([]byte(certificate))
	publicCert := base64.StdEncoding.EncodeToString(pemBlock.Bytes)

	var certs [] string
	certs = append(certs, publicCert)

	hdrs := jws.NewHeaders()
	err := hdrs.Set(jws.X509CertChainKey, certs)

	buf, err := jws.Sign(data, jwa.RS256, keyFromPem, jws.WithHeaders(hdrs))
	if err != nil {
		fmt.Printf("failed to sign payload: %s\n", err)
		return ""
	}

	return string(buf)

}