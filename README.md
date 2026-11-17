# Cydnex website

Two static sites, both on Cloudflare Pages with no build step:

- Repository root: cydnex.com (security services)
- `training/`: training.cydnex.com (Cydnex Academy), a separate Pages project whose root directory is `training`

Routing lives in `functions/_middleware.js`: requests for training.cydnex.com are served from `training/`, and cydnex.com/training* redirects there. It also sets the security headers.
