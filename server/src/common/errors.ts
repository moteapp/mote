import httpErrors from 'http-errors';

export function AuthenticationError(
    message = "Authentication required",
    redirectUrl = "/"
) {
    return httpErrors(401, message, {
      redirectUrl,
      id: "authentication_required",
    });
}

export function InternalError(message = "Internal error") {
    return httpErrors(500, message, {
      id: "internal_error",
    });
}

export function ValidationError(message = "Validation failed") {
	return httpErrors(400, message, {
		id: "validation_error",
	});
}

export function NotFoundError(message = "Resource not found") {
    return httpErrors(404, message, {
        id: "not_found",
    });
}