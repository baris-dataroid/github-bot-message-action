const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
    try {
        // GitHub token'ını ve mesajı alıyoruz
        const token = core.getInput('github-token');
        const message = core.getInput('message') || "Hello! This is a bot message.";

        // GitHub API istemcisi oluşturuyoruz
        const octokit = github.getOctokit(token);

        // PR numarasını alıyoruz
        const prNumber = github.context.payload.pull_request.number;
        const owner = github.context.repo.owner;
        const repo = github.context.repo.repo;

        // Yorum ekleme isteğini yapıyoruz
        const {data: comment} = await octokit.rest.issues.createComment({
            owner,
            repo,
            issue_number: prNumber,
            body: message
        });

        core.setOutput('comment-id', comment.id);
        console.log(`Comment added: ${comment.html_url}`);
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();