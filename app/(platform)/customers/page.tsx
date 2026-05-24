import { CustomersPage } from "@/features/customers/components/customers-page";

type PageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default function Page(props: PageProps) {
  return <CustomersPage searchParams={props.searchParams} />;
}
