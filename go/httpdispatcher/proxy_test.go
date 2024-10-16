package httpdispatcher

import (
	"bytes"
	"context"
	"net"
	"net/http/httptest"
	"net/url"
	"os"
	"regexp"
	"testing"

	"github.com/inverse-inc/packetfence/go/pfconfigdriver"
)

var testproxy Proxy
var ctx = context.Background()

func TestMain(m *testing.M) {
	pfconfigdriver.AddType[pfconfigdriver.PfConfFencing](ctx)
	pfconfigdriver.AddType[pfconfigdriver.PfConfGeneral](ctx)
	pfconfigdriver.AddType[pfconfigdriver.PfConfCaptivePortal](ctx)
	pfconfigdriver.AddType[pfconfigdriver.PfConfParking](ctx)
	passThrough = newProxyPassthrough(ctx)
	rgx, _ := regexp.Compile("captive.apple.com")
	passThrough.proxypassthrough = append(passThrough.proxypassthrough, rgx)
	rgx, _ = regexp.Compile("www.gstatic.com/generate_204")
	passThrough.detectionmechanisms = append(passThrough.detectionmechanisms, rgx)
	passThrough.DetectionMecanismBypass = true
	rgx, _ = regexp.Compile("CaptiveNetworkSupport")
	passThrough.URIException = rgx

	var portalURL url.URL
	var NetIndex net.IPNet
	passThrough.PortalURL = make(map[int]map[*net.IPNet]*url.URL)

	portalURL.Host = "www.packetfence.org"
	portalURL.Path = "/captive-portal"
	portalURL.Scheme = "http"

	NetIndex.Mask = net.IPMask(net.IPv4zero)
	NetIndex.IP = net.IPv4zero
	passThrough.PortalURL[0] = make(map[*net.IPNet]*url.URL)
	passThrough.PortalURL[0][&NetIndex] = &portalURL

	testproxy.addToEndpointList(ctx, "127.0.0.1")
	os.Exit(m.Run())
}

func TestSimpleRedirect(t *testing.T) {
	testproxy := NewProxy(ctx)
	req := httptest.NewRequest("GET", "http://www.inverse.ca", bytes.NewBuffer([]byte("")))
	recorder := httptest.NewRecorder()
	testproxy.ServeHTTP(recorder, req)
	if recorder.Code != 200 {
		t.Fatalf("Received non-302 response: %d\n", recorder.Code)
	}
}

func TestSimpleNotImplemented(t *testing.T) {
	testproxy := NewProxy(ctx)
	req := httptest.NewRequest("POST", "http://www.packetfence.org", bytes.NewBuffer([]byte("")))
	recorder := httptest.NewRecorder()
	testproxy.ServeHTTP(recorder, req)
	if recorder.Code != 501 {
		t.Fatalf("Received non-501 response: %d\n", recorder.Code)
	}
}

func TestSimpleProxy(t *testing.T) {
	testproxy := NewProxy(ctx)
	req := httptest.NewRequest("GET", "http://detectportal.firefox.com", bytes.NewBuffer([]byte("")))
	req.Host = "detectportal.firefox.com"
	recorder := httptest.NewRecorder()
	testproxy.ServeHTTP(recorder, req)
	if recorder.Code != 200 {
		t.Fatalf("Received non-200 response: %d\n", recorder.Code)
	}
}
