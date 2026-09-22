(function (window) {
    "use strict";

    const defaultBaseUrl = "https://innovexa-backend-sqri.onrender.com";

    function getBaseUrl() {
        return (window.INNOVEXA_API_BASE_URL || defaultBaseUrl).replace(/\/+$/, "");
    }

    async function request(path, options) {
        const settings = options || {};
        const method = settings.method || "GET";
        const headers = Object.assign({}, settings.headers || {});
        const fetchOptions = {
            method,
            credentials: "include",
            headers,
        };

        if (settings.body !== undefined && settings.body !== null) {
            fetchOptions.body = typeof settings.body === "string"
                ? settings.body
                : JSON.stringify(settings.body);

            if (!headers["Content-Type"] && !headers["content-type"]) {
                headers["Content-Type"] = "application/json";
            }
        }

        const response = await window.fetch(getBaseUrl() + path, fetchOptions);
        const text = await response.text();
        let data = null;

        if (text) {
            try {
                data = JSON.parse(text);
            } catch (_error) {
                data = text;
            }
        }

        if (!response.ok) {
            const serverError = data && typeof data === "object"
                ? (data.error || data.message || response.statusText)
                : (data || response.statusText);
            const details = data && typeof data === "object" ? data.details : null;
            const message = details
                ? serverError + ": " + (typeof details === "string" ? details : JSON.stringify(details))
                : serverError;
            const error = new Error(message || "Request failed");
            error.status = response.status;
            error.details = details;
            error.data = data;
            throw error;
        }

        return data;
    }

    window.innovexaApi = {
        request,
        signup: function (data) {
            return request("/api/auth/signup", { method: "POST", body: data });
        },
        login: function (data) {
            return request("/api/auth/login", { method: "POST", body: data });
        },
        logout: function () {
            return request("/api/auth/logout", { method: "POST" });
        },
        me: function () {
            return request("/api/auth/me");
        },
    };
}(window));
