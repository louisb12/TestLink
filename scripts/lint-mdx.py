#!/usr/bin/env python3
"""
lint-mdx.py — catch MDX that `mint validate` accepts but a real build rejects.

RULE 1: no JS or JSX comment may appear inside an `export const ...` block.
RULE 2: MDX comment blocks must be balanced — a stray comment terminator ends
        a block early and spills the rest of it into the page as content.

Any comment inside an export block breaks Mintlify's PRODUCTION MDX compiler:
the whole page is replaced with "A parsing error occured". `mint dev` and
`mint validate` both accept them, so the failure is invisible locally and only
appears on a deployed build. Verified against `mint export` — line comments,
block comments, JSX comments inside returned markup, comments inside a data
array, and trailing comments on a code line all fail. See decisions.md D-031.

Page-level MDX comments outside every export are fine.

Exit 1 on any finding.
"""
import pathlib
import re
import sys

SKIP = ("node_modules", "Best Practises", ".git")


def offending_comments(path: pathlib.Path):
    """Yield (line_no, kind, text) for comments inside export blocks."""
    found = []
    depth = 0
    in_export = False
    in_template = False

    for n, line in enumerate(path.read_text().split("\n"), 1):
        stripped = line.strip()

        if not in_export and re.match(r"^export\s+const\s", stripped):
            in_export, depth = True, 0

        if in_export and not in_template:
            kind = None
            if re.match(r"^\s*//", line) or re.match(r"^\s*/\*", line):
                kind = "comment line"
            elif re.search(r"\{/\*", line):
                kind = "JSX comment"
            elif "/*" in line:
                kind = "block comment"
            elif re.search(r"\S\s+//(?!/)", line) and "://" not in line:
                kind = "trailing comment"
            if kind:
                found.append((n, kind, stripped[:70]))

        if in_export:
            # Track template literals so `//` inside a URL is not flagged.
            if line.count("`") % 2 == 1:
                in_template = not in_template
            if not in_template:
                depth += line.count("{") + line.count("(") + line.count("[")
                depth -= line.count("}") + line.count(")") + line.count("]")
                if depth <= 0 and stripped.endswith(";"):
                    in_export = False

    return found


def unbalanced_comment_markers(path: pathlib.Path):
    """Yield (line_no, text) for MDX comment terminators with no open comment.

    An MDX comment ends at the FIRST terminator it meets. Writing that sequence
    inside the comment — e.g. to document the syntax — closes it early, spills
    the remainder into the page as content, and fails the build. The tell is a
    later terminator with nothing open, which is what this finds.
    """
    found = []
    depth = 0
    for n, line in enumerate(path.read_text().split("\n"), 1):
        i = 0
        while i < len(line):
            if line.startswith("{/*", i):
                depth += 1
                i += 3
            elif line.startswith("*/}", i):
                if depth == 0:
                    found.append((n, line.strip()[:70]))
                else:
                    depth -= 1
                i += 3
            else:
                i += 1
    return found


def main() -> int:
    root = pathlib.Path(".")
    problems = []
    for f in sorted(root.glob("**/*.mdx")):
        if any(s in str(f) for s in SKIP):
            continue
        for n, kind, text in offending_comments(f):
            problems.append(f"{f}:{n}: {kind} inside an export block — {text}")
        for n, text in unbalanced_comment_markers(f):
            problems.append(
                f"{f}:{n}: stray MDX comment terminator (a block closed early) — {text}"
            )

    if problems:
        print("\n".join(problems))
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
