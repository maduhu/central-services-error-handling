'use strict'

const Shared = require('@leveloneproject/central-services-shared')
const BaseError = Shared.BaseError
const ErrorCategory = Shared.ErrorCategory

const reformatBoomError = (response) => {
  let errorId = response.output.payload.error.replace(/ /gi, '')
  errorId += (errorId.endsWith('Error')) ? '' : 'Error'
  response.output.payload = {
    error_id: errorId,
    message: response.output.payload.message || response.message
  }
}

exports.onPreResponse = (request, reply) => {
  let response = request.response
  if (response.isBoom) {
    if (response instanceof BaseError) {
      response.output.statusCode = ErrorCategory.getStatusCode(response.category)
      response.output.payload = response.payload
      response.output.headers = response.headers
    } else {
      reformatBoomError(response)
    }
  }

  return reply.continue()
}
