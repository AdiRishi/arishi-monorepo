import { createFileRoute } from "@tanstack/react-router";

import { PaperPage } from "@/features/paper/page";

export const Route = createFileRoute("/")({ component: PaperPage });
