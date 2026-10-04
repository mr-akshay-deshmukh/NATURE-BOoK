# Security Policy 🛡️

## Supported Versions

We actively maintain and provide security updates for the following versions of **Nature BoOk**:

| Version | Supported          |
| ------- | ------------------ |
| 1.x     | :white_check_mark: |
| < 1.0   | :x:                |

---

## 🔒 Reporting a Vulnerability

The Nature BoOk team takes the security and integrity of our software and user data seriously. If you discover a security vulnerability, please follow responsible disclosure:

1. **Do NOT open a public GitHub issue** for sensitive security vulnerabilities.
2. Email your findings directly to the project maintainers or use GitHub's private vulnerability reporting feature under the **Security** tab of this repository.
3. Include the following details in your report:
   - A description of the vulnerability and its potential impact.
   - Exact steps or proof-of-concept (PoC) code to reproduce the issue.
   - Any suggested mitigations or patches if available.

### What to Expect
- **Acknowledgement**: Within 48 hours of receipt.
- **Triage & Assessment**: Within 5 business days.
- **Fix & Public Advisory**: Once a patch is developed, tested, and released.

---

## 🔐 Best Practices for Deployment

- **API Keys**: Never commit `GEMINI_API_KEY`, `GOOGLE_MAPS_PLATFORM_KEY`, or any database credentials to version control. Always utilize `.env` files (ignored by `.gitignore`) or production secret managers.
- **Server Proxy**: All Gemini AI interactions must route through the server-side Express proxy (`server.ts`) to avoid exposing keys to client-side browsers.
- **Input Sanitization**: All user-submitted incident report data is strictly parsed and bounded to prevent injection attacks or memory overflows.
