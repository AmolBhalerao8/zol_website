import { CustomerDetailPage } from "@/features/customers/components/customer-detail-page";

type PageProps = {
  params: Promise<{ customerId: string }>;
};

export default async function Page(props: PageProps) {
  const params = await props.params;
  return <CustomerDetailPage customerId={params.customerId} />;
}
