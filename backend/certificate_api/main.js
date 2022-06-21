const certificateController = require("./src/routes/certificate_controller");
const euCertificateController = require("./src/routes/eu_certificate_controller");
const {initKafa} = require("./src/services/kafka_service");
const {initRedis} = require("./src/services/redis_service");
const config = require("./configs/config");
const http = require('http');
const {KeycloakFactory} = require("./src/services/keycloak_service");
const constants = require("./configs/constants");

const port = process.env.PORT || 4321;

const server = http.createServer(async (req, res) => {
    console.time(req.url)
    console.log(`API ${req.method} ${req.url} called`);
    if (req.method === 'GET' && req.url.match("/certificate/api/certificate/QRCode")) {
        const data = await certificateController.getCertificateQRCode(req, res, constants.ENTITY_TYPES.VACCINATION_CERTIFICATE);
        res.end(data)
    }
    else if(req.method === 'GET' && req.url.startsWith("/certificate/api/beneficiaries")) {
        const data = await certificateController.getCertificateByPhnoAndDob(req, res, constants.ENTITY_TYPES.VACCINATION_CERTIFICATE);
        res.end(JSON.stringify(data));
    }
    else if (req.method === 'GET' && req.url.startsWith("/certificate/api/certificate/")) {
        const data = await certificateController.getCertificate(req, res, constants.ENTITY_TYPES.VACCINATION_CERTIFICATE);
        res.end(data)
    } else if (req.method === 'GET' && req.url.match("/certificate/api/certificatePDF/.+")) {
        const data = await certificateController.getCertificatePDFByPreEnrollmentCode(req, res, constants.ENTITY_TYPES.VACCINATION_CERTIFICATE);
        res.end(data)
    } else if (req.method === 'GET' && req.url.startsWith("/certificate/api/certificatePDF")) {
        const data = await certificateController.getCertificatePDF(req, res, constants.ENTITY_TYPES.VACCINATION_CERTIFICATE);
        res.end(data)
    } else if (req.method === 'HEAD' && req.url.match("/certificate/api/certificatePDF/.+")) {
        const data = await certificateController.checkIfCertificateGenerated(req, res, constants.ENTITY_TYPES.VACCINATION_CERTIFICATE);
        res.end(data)
    } else if (req.method === 'GET' && req.url.startsWith("/certificate/api/fhir-certificate")) {
        const data = await certificateController.certificateAsFHIRJson(req, res, constants.ENTITY_TYPES.VACCINATION_CERTIFICATE);
        res.end(data)
    } else if (req.method === 'POST' && req.url.startsWith("/certificate/api/eu-certificate")) {
        const data = await euCertificateController.certificateAsEUPayload(req, res, constants.ENTITY_TYPES.VACCINATION_CERTIFICATE);
        res.end(data)
    } else if (req.method === 'GET' && req.url.startsWith("/certificate/api/shc-certificate")) {
        const data = await certificateController.certificateAsSHCPayload(req, res, constants.ENTITY_TYPES.VACCINATION_CERTIFICATE);
        res.end(data)
    } else if (req.method === 'GET' && req.url.match("/certificate/api/test/certificatePDF/.+")) {
        const data = await certificateController.getTestCertificatePDFByPreEnrollmentCode(req, res, constants.ENTITY_TYPES.TEST_CERTIFICATE);
        res.end(data)
    } else if (req.method === 'GET' && req.url.match("/certificate/api/certificateQRCode/.+")) {
        const data = await certificateController.getCertificateQRCodeByPreEnrollmentCode(req, res, constants.ENTITY_TYPES.VACCINATION_CERTIFICATE);
        res.end(data)
    } else if (req.method === 'GET' && req.url.match("/certificate/api/v2/.+/certificate")) {
        const data = await certificateController.getCertificateV2(req, res)
        res.end(data)
    } else {
        res.end(`{"error": "${http.STATUS_CODES[404]}"}`)
    }
    console.timeEnd(req.url)
});

server.listen(port, async () => {
    await initKafa();
    await KeycloakFactory.getPublicKey();
    initRedis(config);
    console.log(`Server listening on port ${port}`);
});
