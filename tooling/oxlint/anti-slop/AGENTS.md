# Updating anti-slop

The canonical source is https://github.com/dmmulroy/anti-slop.

When asked to update this plugin, clone the repository and replace the vendored production TypeScript with the latest default-branch commit's `src/` implementation unchanged. Preserve this file, enable every upstream rule including opt-in rule groups, and verify the port against the cloned commit before running the repository checks.
