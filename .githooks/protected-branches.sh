#!/usr/bin/env sh
# Called by pre-push with the lines "<local ref> <local sha> <remote ref> <remote sha>" on stdin.
# Refuses to update or delete main or master on the remote: they only change through a PR (docs/WORKFLOW.md).
# Creating the branch on the remote for the first time (zero remote sha) is allowed.
# Applies to people too: branch protection is not enforced on this private free-plan repository.
zero=0000000000000000000000000000000000000000
status=0
while read -r local_ref local_sha remote_ref remote_sha; do
  case "$remote_ref" in
    refs/heads/main | refs/heads/master)
      [ "$remote_sha" = "$zero" ] && continue
      echo "pre-push: direct push to ${remote_ref#refs/heads/} is forbidden; open a PR (docs/WORKFLOW.md)." >&2
      status=1
      ;;
  esac
done
exit "$status"
