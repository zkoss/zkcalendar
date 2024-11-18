package test.server;

import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.servlet.*;
import org.eclipse.jetty.webapp.WebAppContext;

/**
 * run this for manual test
 */
public class JettyStarter {
    public static void main(String[] args) throws Exception {
        Server server = new Server(8080);
        WebAppContext webapp = new WebAppContext();
        webapp.setContextPath("/test");

        webapp.setResourceBase("src/main/webapp");
        // handle static resources e.g. js, html
        ServletHolder holder = new ServletHolder("default", DefaultServlet.class);
        holder.setInitParameter("dirAllowed", "true");
        holder.setInitParameter("useFileMappedBuffer", "false");
        webapp.addServlet(holder, "/");
        // Enable scanning for annotations
        webapp.setConfigurationClasses(new String[]{
                "org.eclipse.jetty.webapp.WebInfConfiguration",
                "org.eclipse.jetty.webapp.WebXmlConfiguration",
                "org.eclipse.jetty.webapp.MetaInfConfiguration",
                "org.eclipse.jetty.annotations.AnnotationConfiguration"
        });

        webapp.setDefaultsDescriptor(null);
        server.setHandler(webapp);

        try {
            server.start();
            server.join();
        } catch (Exception e) {
            e.printStackTrace();
            System.exit(1);
        }
    }
}
