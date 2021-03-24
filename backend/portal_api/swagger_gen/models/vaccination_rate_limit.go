// Code generated by go-swagger; DO NOT EDIT.

package models

// This file was generated by the swagger tool.
// Editing this file might prove futile when you re-run the swagger generate command

import (
	"context"

	"github.com/go-openapi/strfmt"
	"github.com/go-openapi/swag"
)

// VaccinationRateLimit vaccination rate limit
//
// swagger:model VaccinationRateLimit
type VaccinationRateLimit struct {

	// Program Name
	ProgramName string `json:"programName,omitempty"`

	// Maximum rate of vaccination
	RateLimit int64 `json:"rateLimit,omitempty"`
}

// Validate validates this vaccination rate limit
func (m *VaccinationRateLimit) Validate(formats strfmt.Registry) error {
	return nil
}

// ContextValidate validates this vaccination rate limit based on context it is used
func (m *VaccinationRateLimit) ContextValidate(ctx context.Context, formats strfmt.Registry) error {
	return nil
}

// MarshalBinary interface implementation
func (m *VaccinationRateLimit) MarshalBinary() ([]byte, error) {
	if m == nil {
		return nil, nil
	}
	return swag.WriteJSON(m)
}

// UnmarshalBinary interface implementation
func (m *VaccinationRateLimit) UnmarshalBinary(b []byte) error {
	var res VaccinationRateLimit
	if err := swag.ReadJSON(b, &res); err != nil {
		return err
	}
	*m = res
	return nil
}