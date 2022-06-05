// Code generated by go-swagger; DO NOT EDIT.

package certification

// This file was generated by the swagger tool.
// Editing this file might prove futile when you re-run the generate command

import (
	"net/http"

	"github.com/go-openapi/runtime/middleware"

	"github.com/divoc/api/swagger_gen/models"
)

// CertifyV4HandlerFunc turns a function with the right signature into a certify v4 handler
type CertifyV4HandlerFunc func(CertifyV4Params, *models.JWTClaimBody) middleware.Responder

// Handle executing the request and returning a response
func (fn CertifyV4HandlerFunc) Handle(params CertifyV4Params, principal *models.JWTClaimBody) middleware.Responder {
	return fn(params, principal)
}

// CertifyV4Handler interface for that can handle valid certify v4 params
type CertifyV4Handler interface {
	Handle(CertifyV4Params, *models.JWTClaimBody) middleware.Responder
}

// NewCertifyV4 creates a new http.Handler for the certify v4 operation
func NewCertifyV4(ctx *middleware.Context, handler CertifyV4Handler) *CertifyV4 {
	return &CertifyV4{Context: ctx, Handler: handler}
}

/*CertifyV4 swagger:route POST /v4/{entityType}/certify certification certifyV4

Certify the one or more events of given entityType

*/
type CertifyV4 struct {
	Context *middleware.Context
	Handler CertifyV4Handler
}

func (o *CertifyV4) ServeHTTP(rw http.ResponseWriter, r *http.Request) {
	route, rCtx, _ := o.Context.RouteInfo(r)
	if rCtx != nil {
		r = rCtx
	}
	var Params = NewCertifyV4Params()

	uprinc, aCtx, err := o.Context.Authorize(r, route)
	if err != nil {
		o.Context.Respond(rw, r, route.Produces, route, err)
		return
	}
	if aCtx != nil {
		r = aCtx
	}
	var principal *models.JWTClaimBody
	if uprinc != nil {
		principal = uprinc.(*models.JWTClaimBody) // this is really a models.JWTClaimBody, I promise
	}

	if err := o.Context.BindValidRequest(r, route, &Params); err != nil { // bind params
		o.Context.Respond(rw, r, route.Produces, route, err)
		return
	}

	res := o.Handler.Handle(Params, principal) // actually handle the request

	o.Context.Respond(rw, r, route.Produces, route, res)

}
