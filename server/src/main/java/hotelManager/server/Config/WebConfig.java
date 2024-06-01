package hotelManager.server.Config;

import org.springframework.context.annotation.Configuration;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.servlet.config.annotation.PathMatchConfigurer;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;


@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void configurePathMatch(PathMatchConfigurer configurer) {
        configurer.setPathMatcher(new AntPathMatcher());
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {

        WebMvcConfigurer.super.addResourceHandlers(registry);

        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/")
                .addResourceLocations("classpath:/META-INF/resources/")
                .addResourceLocations("classpath:/resources/")
                .addResourceLocations("classpath:/public/");
    }

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        // Single level route
        registry.addViewController("/{path:[^\\.]*}")
                .setViewName("forward:/index.html");

        // Multi level route
        registry.addViewController("/{path:[^\\.]*}/**{path:[^\\.]*}")
                .setViewName("forward:/index.html");

        registry.addViewController("/reset/form/{email}/{token}")
                .setViewName("forward:/index.html");

        registry.addViewController("/register/form/{email}/{token}/{role}")
                .setViewName("forward:/index.html");
    }


}
