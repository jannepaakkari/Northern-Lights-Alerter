## Northen Lights Alerter
Northern Lights Alerter is an application that displays the current status of the northern lights (aurora borealis) in Finland using an external Finnish API. You can also subscribe and unsubscribe to alerts, which will notify you via email when the northern lights are visible.

## Technologies Used

- Next.js
- Node.js
- React.js
- TypeScript
- NextUI v2
- Tailwind CSS
- Next-themes
- GitHub Actions
- External API integrations
- Nodemailer (Gmail integration)
- MongoDB

## How to Use

### Install dependencies

You can use one of them `npm`, `yarn`, `pnpm`, `bun`, Example using `npm`:

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

### Setup pnpm (optional)

If you are using `pnpm`, you need to add the following code to your `.npmrc` file:

```bash
public-hoist-pattern[]=*@nextui-org/*
```

After modifying the `.npmrc` file, you need to run `pnpm install` again to ensure that the dependencies are installed correctly.

## License

Licensed under the [MIT license](https://github.com/nextui-org/next-app-template/blob/main/LICENSE).
