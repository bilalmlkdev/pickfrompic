# Security Policy

## Supported versions

Only the latest version on [main](https://github.com/bilalmlkdev/pickfrompic)
and the deployed site at [pickfrompic.vercel.app](https://pickfrompic.vercel.app)
are supported.

## Reporting a vulnerability

Please do not open a public issue for security problems.

Report privately via GitHub Security Advisories:

https://github.com/bilalmlkdev/pickfrompic/security/advisories/new

Or contact the maintainer directly:

https://github.com/bilalmlkdev

Include:

- What the issue is
- Steps to reproduce
- Impact if you know it
- Any suggested fix if you have one

You should get a response within a few days. Please give time to fix the
issue before any public disclosure.

## Scope notes

pickfrompic runs entirely in the browser:

- No backend or API of its own
- Saved items live in `localStorage` only
- Images are processed locally when possible

Still report anything like XSS, unsafe URL handling, or data leaks if you
find them.
