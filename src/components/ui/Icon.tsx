import {
  Building2,
  ClipboardList,
  Factory,
  House,
  Search,
  ShieldCheck,
  Smartphone,
  Store,
  Wrench,
  type LucideProps,
} from "lucide-react";
import type { IconName } from "@/content/site.tr";

const map = {
  search: Search,
  clipboard: ClipboardList,
  wrench: Wrench,
  smartphone: Smartphone,
  shield: ShieldCheck,
  home: House,
  store: Store,
  factory: Factory,
  building: Building2,
} satisfies Record<IconName, unknown>;

export function Icon({ name, ...props }: { name: IconName } & LucideProps) {
  const Cmp = map[name];
  return <Cmp aria-hidden="true" {...props} />;
}
