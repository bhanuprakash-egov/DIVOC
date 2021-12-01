package services

import (
	"encoding/json"

	"github.com/divoc/api/config"
	"github.com/divoc/api/pkg/models"
	log "github.com/sirupsen/logrus"
)

var messages = make(chan Message)
var enrollmentMessages = make(chan Message)
var testMessages = make(chan Message)
var events = make(chan []byte)
var reportedSideEffects = make(chan []byte)

type Message struct {
	UploadId []byte
	rowId    []byte
	payload  string
}

const CommunicationModeRabbitmq = "rabbitmq"
const CommunicationModeKafka = "kafka"
const CommunicationModeRestapi = "restapi"

func InitializeCommunication() {
	switch config.Config.CommunicationMode.Mode {
	case CommunicationModeRabbitmq:
		InitializeRabbitmq()
		break
	case CommunicationModeKafka:
		InitializeKafka()
		break
	case CommunicationModeRestapi:
		log.Errorf("Rest-API communication mode isn not supported yet")
		break
	default:
		log.Errorf("Invalid CommunicationMode %s", config.Config.CommunicationMode)
	}
}

func PublishCertifyMessage(message []byte, uploadId []byte, rowId []byte) {
	messages <- Message{
		UploadId: uploadId,
		rowId:    rowId,
		payload:  string(message),
	}
}

func PublishTestCertifyMessage(message []byte, uploadId []byte, rowId []byte) {
	testMessages <- Message{
		UploadId: uploadId,
		rowId:    rowId,
		payload:  string(message),
	}
}

func PublishWalkEnrollment(message []byte) {
	enrollmentMessages <- Message{
		UploadId: nil,
		rowId:    nil,
		payload:  string(message),
	}
}

func PublishEvent(event models.Event) {
	if messageJson, err := json.Marshal(event); err != nil {
		log.Errorf("Error in getting json of event %+v", event)
	} else {
		events <- messageJson
	}
}

func PublishReportedSideEffects(event models.ReportedSideEffectsEvent) {
	log.Infof("Publishing reported side effects")
	if messageJson, err := json.Marshal(event); err != nil {
		log.Errorf("Error in getting json of event %+v", event)
	} else {
		reportedSideEffects <- messageJson
	}
	log.Infof("Successfully published reported side Effects")
}