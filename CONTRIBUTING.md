# Contributing to pickfrompic

Thanks for wanting to help. This project stays small and local-first on purpose, so contributions that keep that direction are the most useful.

## Before you start

- Search [existing issues](https://github.com/bilalmlkdev/pickfrompic/issues) first
- Open an issue for larger changes before writing code
- Small fixes (typos, bugs, layout) can go straight to a pull request

## Local setup

```bash
git clone https://github.com/bilalmlkdev/pickfrompic.git
cd pickfrompic
npm install
npm run dev
```

No backend, no accounts, no required env vars for development.

## Checks before you push

Run all three. CI runs the same commands.

```bash
npm run lint
npm run typecheck
npm run build
```

## How to contribute

1. Fork the repo
2. Create a branch: `git checkout -b fix/short-description`
3. Make your changes
4. Run the checks above
5. Commit with a clear message
6. Open a pull request

## What makes a good pull request

- One focused change per PR
- Describe what changed and why
- Link the related issue if there is one
- Screenshots for UI changes
- No unrelated refactors in the same PR

## Style

- TypeScript strict, no `any` unless there is no other option
- Tailwind utility classes for layout and spacing
- Keep components small; color math stays in `src/utils/ColorMath.ts`
- Follow existing naming and file structure
- Do not commit secrets, keys, or `.env` files

## Reporting bugs

Use the bug report issue template. Include:

- Steps to reproduce
- Expected vs actual behavior
- Browser and OS
- Screenshots or a short recording if you can

## Security issues

Do not open a public issue for security reports. See [SECURITY.md](./SECURITY.md).

## License

By contributing, you agree that your contributions are licensed under the [MIT License](./LICENSE).
