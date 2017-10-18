name = resize-on-demand
testname = $(name)-dev
region = us-west-2

all: test
release: native update

update:
	@echo updating...
	@zip -9qr package.zip index.js node_modules
	@aws lambda update-function-code \
		--function-name $(name) \
		--region $(region) \
		--zip-file fileb://package.zip
	@rm -f package.zip

native:
	@echo compiling native modules...
	@rm -rf node_modules
	@cat package.json | ssh $(REMOTE) "cat > package.json && rm -rf node_modules && npm install 1>&2 && tar cj node_modules" | tar xjf -

test:
	@echo updating function...
	@zip -9qr test-package.zip index.js node_modules
	@aws lambda update-function-code \
		--function-name $(testname) \
		--region $(region) \
		--zip-file fileb://test-package.zip
	@rm -f test-package.zip

test-invoke:
	@echo running...
	@aws lambda invoke \
		--function-name $(testname) \
		--invocation-type RequestResponse \
		--log-type Tail \
		--payload fileb://test-payload.json \
		test-output | jq -r '.LogResult' | base64 --decode
