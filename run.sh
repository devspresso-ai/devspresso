#!/bin/bash
export FLASK_APP=main
export FLASK_DEBUG=1
flask run --cert=cert.pem --key=key.pem -h localhost -p 8000
