// Code generated by go-swagger; DO NOT EDIT.

package identity

// This file was generated by the swagger tool.
// Editing this file might prove futile when you re-run the generate command

import (
	"net/http"

	"github.com/go-openapi/runtime/middleware"
)

// PostIdentityVerifyHandlerFunc turns a function with the right signature into a post identity verify handler
type PostIdentityVerifyHandlerFunc func(PostIdentityVerifyParams, interface{}) middleware.Responder

// Handle executing the request and returning a response
func (fn PostIdentityVerifyHandlerFunc) Handle(params PostIdentityVerifyParams, principal interface{}) middleware.Responder {
	return fn(params, principal)
}

// PostIdentityVerifyHandler interface for that can handle valid post identity verify params
type PostIdentityVerifyHandler interface {
	Handle(PostIdentityVerifyParams, interface{}) middleware.Responder
}

// NewPostIdentityVerify creates a new http.Handler for the post identity verify operation
func NewPostIdentityVerify(ctx *middleware.Context, handler PostIdentityVerifyHandler) *PostIdentityVerify {
	return &PostIdentityVerify{Context: ctx, Handler: handler}
}

/*PostIdentityVerify swagger:route POST /identity/verify identity postIdentityVerify

Validate identity if the person

*/
type PostIdentityVerify struct {
	Context *middleware.Context
	Handler PostIdentityVerifyHandler
}

func (o *PostIdentityVerify) ServeHTTP(rw http.ResponseWriter, r *http.Request) {
	route, rCtx, _ := o.Context.RouteInfo(r)
	if rCtx != nil {
		r = rCtx
	}
	var Params = NewPostIdentityVerifyParams()

	uprinc, aCtx, err := o.Context.Authorize(r, route)
	if err != nil {
		o.Context.Respond(rw, r, route.Produces, route, err)
		return
	}
	if aCtx != nil {
		r = aCtx
	}
	var principal interface{}
	if uprinc != nil {
		principal = uprinc
	}

	if err := o.Context.BindValidRequest(r, route, &Params); err != nil { // bind params
		o.Context.Respond(rw, r, route.Produces, route, err)
		return
	}

	res := o.Handler.Handle(Params, principal) // actually handle the request

	o.Context.Respond(rw, r, route.Produces, route, res)

}