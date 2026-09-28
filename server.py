from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlsplit, unquote

class PreviewHandler(SimpleHTTPRequestHandler):
    def translate_path(self, path):
        clean = unquote(urlsplit(path).path)
        aliases = {
            '/manus-routes.json': '/public/manus-routes.json',
            '/favicon.svg': '/public/favicon.svg',
            '/vinhocego-icon.png': '/public/vinhocego-icon.png',
        }
        return super().translate_path(aliases.get(clean, clean))

    def log_message(self, format, *args):
        print('%s - - [%s] %s' % (self.client_address[0], self.log_date_time_string(), format % args))

if __name__ == '__main__':
    ThreadingHTTPServer(('0.0.0.0', 3000), PreviewHandler).serve_forever()
