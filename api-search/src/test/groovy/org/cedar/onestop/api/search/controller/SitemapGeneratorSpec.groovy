package org.cedar.onestop.api.search.controller

import spock.lang.Specification
import spock.lang.Unroll

class SitemapGeneratorSpec extends Specification {

  @Unroll
  def 'Sitemap uses correct baseUrl from request #requestUrl'() {
    when:
    String baseUrl = SitemapGenerator.getBaseUrl(requestUrl)

    then:
    baseUrl == expectedUrl

    where:
    requestUrl | expectedUrl
    // what is (currently) sent by localhost client
    "http://localhost/onestop/api/sitemap.xml" | "http://localhost/onestop"
    // local dev curl
    "http://localhost:30097/onestop/api/sitemap.xml" | "http://localhost:30097/onestop"
    // sciapps
    "https://sciapps/onestop/api/sitemap.xml" | "https://sciapps/onestop"
  }

  def 'Sitemap xml is correct with one submap'() {
    given:
    def data = [[id:'AWUByPEUY2tHcYwYu62K', type:null, attributes:[lastUpdatedDate:1533333269487]]]

    when:
    def xml = SitemapGenerator.makeSitemap('baseUrl', data)

    then:
    simplifyMultilineComparison(xml, """
      <?xml version="1.0" encoding="UTF-8"?>
        <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

      <sitemap>
        <loc>baseUrl/api/sitemap/AWUByPEUY2tHcYwYu62K.txt</loc>
        <lastmod>2018-08-03</lastmod>
      </sitemap>

      </sitemapindex>
    """ )
  }

  def 'Sitemap xml is correct with several submaps'() {
    given:
    def data = [
      [id:'AWUByPEUY2tHcYwYu62K', type:null, attributes:[lastUpdatedDate:1533333269487]],
      [id:'XYZByPEUY2tHcYwYu62K', type:null, attributes:[lastUpdatedDate:1533233269487]],
      [id:'123ByPEUY2tHcYwYu62K', type:null, attributes:[lastUpdatedDate:1533133269487]],
    ]

    when:
    def xml = SitemapGenerator.makeSitemap('baseUrl', data)

    then:
    simplifyMultilineComparison(xml, """
      <?xml version="1.0" encoding="UTF-8"?>
        <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

      <sitemap>
        <loc>baseUrl/api/sitemap/AWUByPEUY2tHcYwYu62K.txt</loc>
        <lastmod>2018-08-03</lastmod>
      </sitemap>


      <sitemap>
        <loc>baseUrl/api/sitemap/XYZByPEUY2tHcYwYu62K.txt</loc>
        <lastmod>2018-08-02</lastmod>
      </sitemap>


      <sitemap>
        <loc>baseUrl/api/sitemap/123ByPEUY2tHcYwYu62K.txt</loc>
        <lastmod>2018-08-01</lastmod>
      </sitemap>

      </sitemapindex>
    """ )
  }

  private simplifyMultilineComparison(String actual, String expected) {
    def str1 = actual.stripIndent()
    def str2 = expected.stripIndent()

    // because debugging multiline string differences is a pain:
    println("Actual:~~~${str1}~~~")
    println("Expected:---${str2}---")

    return str1 == str2
  }

  def 'submap generates correct text from data'() {
    given:
    def data = [[id:'AWUByPEUY2tHcYwYu62K', type:null, attributes:[lastUpdatedDate:1533333269487, content:['AWRISjND41RXYexPu0jX', 'AWRISjdu41RXYexPu0ja', 'AWRISkI641RXYexPu0jh', 'AWRISjFx41RXYexPu0jW', 'AWRISkRr41RXYexPu0jj', 'AWRISiae41RXYexPu0jP', 'AWRISkmw41RXYexPu0jo', 'AWRISjqg41RXYexPu0jb', 'AWRISi5g41RXYexPu0jU']]]]

    when:
    def submap = SitemapGenerator.makeSiteSubmap('baseUrl', data)

    then:
    simplifyMultilineComparison(submap, """\
      baseUrl/#/collections/details/AWRISjND41RXYexPu0jX
      baseUrl/#/collections/details/AWRISjdu41RXYexPu0ja
      baseUrl/#/collections/details/AWRISkI641RXYexPu0jh
      baseUrl/#/collections/details/AWRISjFx41RXYexPu0jW
      baseUrl/#/collections/details/AWRISkRr41RXYexPu0jj
      baseUrl/#/collections/details/AWRISiae41RXYexPu0jP
      baseUrl/#/collections/details/AWRISkmw41RXYexPu0jo
      baseUrl/#/collections/details/AWRISjqg41RXYexPu0jb
      baseUrl/#/collections/details/AWRISi5g41RXYexPu0jU""" )

  }

}
