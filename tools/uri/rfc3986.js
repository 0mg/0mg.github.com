/* All quotes(#RFC4234) are from
     RFC 4234 Augmented BNF for Syntax Specifications: ABNF
     Copyright (C) The Internet Society (2005).
     http://www.ietf.org/rfc/rfc4234.txt
*/
/* All quotes(#RFC3986) are from
     RFC 3986 URI Generic Syntax
     Copyright (C) The Internet Society (2005).
     http://www.ietf.org/rfc/rfc3986.txt
*/
var URISyntax = new function() {
  // Grouping Functions

  function g() {
    return "(?:" + Array.prototype.join.call(arguments, "|") + ")";
  }
  function c(count) {
    return g.apply(null, Array.prototype.slice.call(arguments, 1)) + count;
  }


  // RFC4234 : [Page 13]

  // ALPHA   = %x41-5A / %x61-7A ; A-Z / a-z #RFC4234
  var ALPHA  = "[A-Za-z]";
  // DIGIT   = %x30-39 #RFC4234
  var DIGIT  = "\\d";
  // HEXDIG  = DIGIT / "A" / "B" / "C" / "D" / "E" / "F" #RFC4234
  var HEXDIG = "[\\dA-F]";


  // RFC3986       : [Page 49]

  /* sub-delims    = "!" / "$" / "&" / "'" / "(" / ")"
                   / "*" / "+" / "," / ";" / "=" #RFC3986 */
  var subDelims    = "[!$&'()*+,;=]";
  // gen-delims    = ":" / "/" / "?" / "#" / "[" / "]" / "@" #RFC3986
  var genDelims    = "[:/?#\\[\\]@]";

  // reserved      = gen-delims / sub-delims #RFC3986
  var reserved     = g(genDelims, subDelims);

  // unreserved    = ALPHA / DIGIT / "-" / "." / "_" / "~" #RFC3986
  var unreserved   = g(ALPHA, DIGIT, "[-._~]");

  // pct-encoded   = "%" HEXDIG HEXDIG
  var pctEncoded   = "%" + HEXDIG + HEXDIG;

  // pchar         = unreserved / pct-encoded / sub-delims / ":" / "@" #RFC3986
  var pchar        = g(unreserved, pctEncoded, subDelims, "[:@]");

  // query         = *( pchar / "/" / "?" )
  var query        = c("*", pchar, "[/?]");

  // fragment      = *( pchar / "/" / "?" )
  var fragment     = c("*", pchar, "[/?]");

  // segment       = *pchar #RFC3986
  var segment      = c("*", pchar);
  // segment-nz    = 1*pchar #RFC3986
  var segmentNz    = c("+", pchar);
  // segment-nz-nc = 1*( unreserved / pct-encoded / sub-delims / "@" ) #RFC3986
  var segmentNzNc  = c("+", unreserved, pctEncoded, subDelims, "@");

  // path-abempty  = *( "/" segment ) #RFC3986
  var pathAbempty  = c("*", "/" + segment);
  // path-absolute = "/" [ segment-nz *( "/" segment ) ] #RFC3986
  var pathAbsolute = "/" + c("?", segmentNz + c("*", "/" + segment));
  // path-noscheme = segment-nz-nc *( "/" segment ) #RFC3986
  var pathNoscheme = segmentNzNc + c("*", "/" + segment);
  // path-rootless = segment-nz *( "/" segment ) #RFC3986
  var pathRootless = segmentNz + c("*", "/" + segment);
  // path-empty    = 0<pchar> #RFC3986
  var pathEmpty    = c("{0}", pchar);

  /* path          = path-abempty    ; begins with "/" or is empty
                   / path-absolute   ; begins with "/" but not "//"
                   / path-noscheme   ; begins with a non-colon segment
                   / path-rootless   ; begins with a segment
                   / path-empty      ; zero characters #RFC3986 */
  var path         = g(pathAbempty
                   , pathAbsolute
                   , pathNoscheme
                   , pathRootless
                   , pathEmpty);

  // reg-name      = *( unreserved / pct-encoded / sub-delims ) #RFC3986
  var regName      = c("*", unreserved, pctEncoded, subDelims);

  /* dec-octet     = DIGIT                 ; 0-9
                   / %x31-39 DIGIT         ; 10-99
                   / "1" 2DIGIT            ; 100-199
                   / "2" %x30-34 DIGIT     ; 200-249
                   / "25" %x30-35          ; 250-255 #RFC3986 */
  var decOctet     = g.apply(null, [
                     DIGIT
                   , "[1-9]" + DIGIT
                   , "1" + c("{2}", DIGIT)
                   , "2" + "[0-4]" + DIGIT
                   , "25" + "[0-5]"
                     ].reverse());


  // RFC3986       : [Page 48]

  /* IPv4address   = dec-octet "." dec-octet "." dec-octet "." dec-octet
                     #RFC3986 */
  var IPv4address  = decOctet + "\\." + decOctet + "\\." +
                     decOctet + "\\." + c("(?=$|[:/?#])", decOctet);

  // h16           = 1*4HEXDIG #RFC3986
  var h16          = c("{1,4}", HEXDIG);
  //ls32           = ( h16 ":" h16 ) / IPv4address #RFC3986
  var ls32         = g(h16 + ":" + h16, IPv4address);

  /* IPv6address   =                            6( h16 ":" ) ls32
                   /                       "::" 5( h16 ":" ) ls32
                   / [               h16 ] "::" 4( h16 ":" ) ls32
                   / [ *1( h16 ":" ) h16 ] "::" 3( h16 ":" ) ls32
                   / [ *2( h16 ":" ) h16 ] "::" 2( h16 ":" ) ls32
                   / [ *3( h16 ":" ) h16 ] "::"    h16 ":"   ls32
                   / [ *4( h16 ":" ) h16 ] "::"              ls32
                   / [ *5( h16 ":" ) h16 ] "::"              h16
                   / [ *6( h16 ":" ) h16 ] "::" #RFC3986 */
  var IPv6address  = g(                           c("{6}", h16 + ":") + ls32,
                                           "::" + c("{5}", h16 + ":") + ls32,
     c("?",                         h16) + "::" + c("{4}", h16 + ":") + ls32,
     c("?", c("{0,1}", h16 + ":") + h16) + "::" + c("{3}", h16 + ":") + ls32,
     c("?", c("{0,2}", h16 + ":") + h16) + "::" + c("{2}", h16 + ":") + ls32,
     c("?", c("{0,3}", h16 + ":") + h16) + "::" +          h16 + ":"  + ls32,
     c("?", c("{0,4}", h16 + ":") + h16) + "::"                       + ls32,
     c("?", c("{0,5}", h16 + ":") + h16) + "::"                       + h16,
     c("?", c("{0,6}", h16 + ":") + h16) + "::" );

  /* IPvFuture     = "v" 1*HEXDIG "." 1*( unreserved / sub-delims / ":" )
                     #RFC3986 */
  var IPvFuture    = "v" + c("+", HEXDIG) + "\\." +
                                   c("+", unreserved, subDelims, ":");

  // IP-literal    = "[" ( IPv6address / IPvFuture  ) "]" #RFC3986
  var IPLiteral    = "\\[" + g(IPv6address, IPvFuture) + "\\]";

  // host          = IP-literal / IPv4address / reg-name #RFC3986
  var host         = g(IPLiteral, IPv4address, regName);
  // port          = *DIGIT #RFC3986
  var port         = c("*", DIGIT);
  // userinfo      = *( unreserved / pct-encoded / sub-delims / ":" ) #RFC3986
  var userInfo     = c("*", unreserved, pctEncoded, subDelims, ":");
  // authority     = [ userinfo "@" ] host [ ":" port ] #RFC3986
  var authority    = c("?", userInfo + "@") + host + c("?", ":" + port);

  // scheme        = ALPHA *( ALPHA / DIGIT / "+" / "-" / "." ) #RFC3986
  var scheme       = ALPHA + c("*", ALPHA, DIGIT, "[-+.]");

  /* relative-part = "//" authority path-abempty
                   / path-absolute
                   / path-noscheme
                   / path-empty #RFC3986 */
  var relativePart = g("//" + authority + pathAbempty
                   , pathAbsolute
                   , pathNoscheme
                   , pathEmpty);

  // relative-ref  = relative-part [ "?" query ] [ "#" fragment ] #RFC3986
  var relativeRef  = relativePart + c("?", "\\?" + query) +
                                    c("?", "#" + fragment);

  /* hier-part     = "//" authority path-abempty
                   / path-absolute
                   / path-rootless
                   / path-empty #RFC3986 */
  var hierPart     = g("//" + authority + pathAbempty
                   , pathAbsolute
                   , pathRootless
                   , pathEmpty);

  // absolute-URI  = scheme ":" hier-part [ "?" query ] #RFC3986
  var absoluteURI  = scheme + ":" + hierPart + c("?", "\\?" + query);

  /* URI           = scheme ":" hier-part [ "?" query ] [ "#" fragment ]
                     #RFC3986 */
  var URI          = scheme + ":" + hierPart + c("?", "\\?" + query) +
                                               c("?", "#" + fragment);

  // URI-reference = URI / relative-ref #RFC3986
  var URIReference = g(URI, relativeRef);


  return {
    g: g,
    c: c,
    ALPHA: ALPHA,
    DIGIT: DIGIT,
    HEXDIG: HEXDIG,
    subDelims: subDelims,
    genDelims: genDelims,
    reserved: reserved,
    unreserved: unreserved,
    pctEncoded: pctEncoded,
    pchar: pchar,
    segment: segment,
    segmentNz: segmentNz,
    segmentNzNc: segmentNzNc,
    pathAbempty: pathAbempty,
    pathAbsolute: pathAbsolute,
    pathNoscheme: pathNoscheme,
    pathRootless: pathRootless,
    pathEmpty: pathEmpty,
    path: path,
    decOctet: decOctet,
    IPv4address: IPv4address,
    h16: h16,
    ls32: ls32,
    IPv6address: IPv6address,
    IPvFuture: IPvFuture,
    IPLiteral: IPLiteral,
    regName: regName,
    host: host,
    port: port,
    userInfo: userInfo,
    authority: authority,
    scheme: scheme,
    hierPart: hierPart,
    query: query,
    absoluteURI: absoluteURI,
    fragment: fragment,
    relativePart: relativePart,
    relativeRef: relativeRef,
    URI: URI,
    URIReference: URIReference
  };
};
