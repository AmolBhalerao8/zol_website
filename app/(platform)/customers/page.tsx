import { CustomersPage } from "@/features/customers/components/customers-page";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function Page(props: PageProps) {
  return <CustomersPage searchParams={props.searchParams} />;
}
