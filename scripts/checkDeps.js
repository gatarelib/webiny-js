/* eslint-disable */
const { argv } = require("yargs");
const depcheck = require("depcheck");
const chalk = require("chalk");

// These deps will be ignored (eg. "@babel/runtime" must be a project dep, but doesn't need to be imported).
const IGNORE_DEPS = {
    dependencies: ["@babel/runtime"],
    devDependencies: ["@babel/cli", "@babel/core", "@svgr/webpack", "babel-plugin-module-resolver"],
    missing: ["@babel/runtime"]
};

const args = { dirs: argv._ };

const checkPackage = async ({ dir }) => {
    const { dependencies, devDependencies, missing } = await depcheck(
        process.cwd() + "/" + dir,
        {}
    );

    const output = {
        dir,
        errors: {
            count: 0,
            list: {
                dependencies: dependencies.filter(dep => !IGNORE_DEPS.dependencies.includes(dep)),
                devDependencies: devDependencies.filter(
                    dep => !IGNORE_DEPS.devDependencies.includes(dep)
                ),
                missing: Object.keys(missing).filter(dep => !IGNORE_DEPS.missing.includes(dep))
            }
        }
    };

    output.errors.count =
        output.errors.list.dependencies.length +
        output.errors.list.devDependencies.length +
        output.errors.list.missing.length;

    return output;
};

const checks = [];
for (let i = 0; i < args.dirs.length; i++) {
    let dir = args.dirs[i];
    checks.push(checkPackage({ dir }));
}

Promise.all(checks).then(results => {
    const packagesWithErrors = results.filter(r => r.errors.count);
    if (packagesWithErrors.length === 0) {
        console.log(chalk.green("Dependencies looking good!"));
        return process.exit(0);
    }

    console.log(
        chalk.red("Following packages are missing dependencies in their package.json files:")
    );
    packagesWithErrors.forEach((pckg, index) => {
        console.log(chalk.cyan(`${index + 1}. ${pckg.dir}`));
        console.log(pckg.errors);
        process.exit(0);
        pckg.errors.forEach((item, index) => {
            console.log(`➜ ${item.name}`);
        });
        console.log("");
    });

    process.exit(1);
});
