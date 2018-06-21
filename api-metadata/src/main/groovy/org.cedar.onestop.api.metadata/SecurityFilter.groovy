//package org.cedar.onestop.api.metadata
//
//import org.cedar.onestop.api.metadata.security.SAMLFilter
//import org.cedar.onestop.api.metadata.security.SPCredentialsParam
//import org.springframework.beans.factory.annotation.Autowired
//import org.springframework.boot.autoconfigure.web.ServerProperties
//import org.springframework.stereotype.Component
//import org.springframework.web.filter.GenericFilterBean
//
//import javax.servlet.FilterChain
//import javax.servlet.ServletException
//import javax.servlet.ServletRequest
//import javax.servlet.ServletResponse
//
//@Component
//class SecurityFilter extends GenericFilterBean {
//
//    private SAMLFilter samlFilter
//
//    @Autowired
//    private ServerProperties serverProperties
//
//    @Override
//    protected void initFilterBean() throws ServletException {
//
//        // initialize keystore information based on config
//        SPCredentialsParam.setKeyStorePassword(serverProperties.ssl.keyStorePassword)
//        SPCredentialsParam.setKeyStorePath(serverProperties.ssl.keyStore)
//        SPCredentialsParam.setKeyPassword(serverProperties.ssl.keyPassword)
//        SPCredentialsParam.setAlias(serverProperties.ssl.keyAlias)
//
//        samlFilter = new SAMLFilter()
//        samlFilter.init()
//    }
//
//    @Override
//    void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
//        samlFilter.doFilter(request, response, chain)
//    }
//
//    @Override
//    void destroy() {
//        samlFilter.destroy()
//    }
//}
