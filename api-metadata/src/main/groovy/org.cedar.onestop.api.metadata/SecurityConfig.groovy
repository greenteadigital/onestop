//package org.cedar.onestop.api.metadata
//
//import org.springframework.beans.factory.annotation.Autowired
//import org.springframework.context.annotation.Configuration
//import org.springframework.security.config.annotation.web.builders.HttpSecurity
//import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
//import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter
//import org.springframework.security.web.access.channel.ChannelProcessingFilter
//import org.springframework.security.web.authentication.www.BasicAuthenticationFilter
//
//@Configuration
//@EnableWebSecurity
//class SecurityConfig extends WebSecurityConfigurerAdapter {
//
//    @Autowired
//    private SecurityFilter accessFilter
//
//    @Override
//    protected void configure(HttpSecurity http) throws Exception {
//        http.antMatcher("/admin/**")
//            .addFilterBefore(accessFilter, ChannelProcessingFilter.class)
//    }
//}
//
