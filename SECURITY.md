# Security Policy

## Supported versions

This project is a static GitHub Pages site and does not maintain multiple long-lived release branches. Security fixes are applied to the current `main` branch.

| Version / branch | Security support |
| --- | --- |
| `main` | Supported |
| Older commits / archived deployments | Not supported |

## Reporting a vulnerability

Please **do not report security vulnerabilities in a public GitHub issue, discussion, pull request, or public chat**.

Use GitHub's private vulnerability-reporting mechanism from the repository's **Security** tab when it is available. A private report should include:

- A clear description of the vulnerability.
- The affected file, feature or URL.
- Steps to reproduce the issue.
- The potential security impact.
- Any proof-of-concept material that is safe to share privately.
- Suggested remediation, if you have one.

If private vulnerability reporting is unavailable, use a private communication channel with the repository maintainer rather than publicly disclosing exploit details. Do not include secrets, passwords, API keys or other sensitive personal information in a report unless it is necessary for investigation.

## What to report

Examples of issues worth reporting privately include:

- Cross-site scripting (XSS) or unsafe HTML/DOM injection.
- Authentication or authorization bypasses, if functionality requiring them is introduced.
- Exposure of secrets, credentials or private data.
- Malicious or compromised third-party dependencies or scripts.
- Unsafe service-worker caching that could expose or serve attacker-controlled content.
- Supply-chain or GitHub Actions vulnerabilities.
- Open redirects or unsafe external-link handling that create a meaningful security impact.
- Any other issue that could compromise users, contributors or the project's infrastructure.

Normal UI bugs, incorrect pandal information, broken links, visual problems and feature requests should normally be reported as regular GitHub issues instead.

## Response process

Maintainers will make a reasonable effort to:

1. Acknowledge receipt of a private report.
2. Reproduce and assess the reported issue.
3. Determine severity and affected versions or commits.
4. Develop and test a fix where appropriate.
5. Publish the fix and an appropriate advisory or acknowledgement when disclosure is safe.

Response and remediation time can vary depending on severity, reproducibility and the project's maintenance capacity.

## Responsible disclosure

Please allow maintainers reasonable time to investigate and fix a vulnerability before publicly disclosing technical exploit details. Coordinated disclosure helps protect people using the site and other projects that may depend on its code.

Do not perform destructive testing, access accounts or data that do not belong to you, or intentionally disrupt the live site or GitHub infrastructure while investigating a suspected vulnerability.

## Third-party services

The site uses external services and libraries, including CDN-hosted assets, Leaflet, Google Maps links and Wikimedia Commons image URLs. Vulnerabilities that clearly originate in a third-party service should also be reported to that provider through its official security process when appropriate, while project-specific integration risks should still be reported privately to this project.

## Security boundaries

This project is primarily a static frontend. It does not intentionally provide a private backend, user account system or server-side database. Browser-stored route, favourite, visited and notebook state should therefore be treated as local client-side data rather than a secure private storage service.
