"""Serve the bundled preview locally with correct module MIME types on Windows."""
from argparse import ArgumentParser
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


class Handler(SimpleHTTPRequestHandler):
    extensions_map = {**SimpleHTTPRequestHandler.extensions_map,
                      '.mjs': 'text/javascript', '.js': 'text/javascript',
                      '.css': 'text/css', '.woff2': 'font/woff2'}

    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache')
        super().end_headers()


def main():
    parser = ArgumentParser(description=__doc__)
    parser.add_argument('--port', type=int, default=8493)
    args = parser.parse_args()
    root = Path(__file__).resolve().parent.parent / 'assets'
    server = ThreadingHTTPServer(('127.0.0.1', args.port), partial(Handler, directory=str(root)))
    print(f'Preview: http://127.0.0.1:{args.port}/web/preview.html', flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == '__main__':
    main()
