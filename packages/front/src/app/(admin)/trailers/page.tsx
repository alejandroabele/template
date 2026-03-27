import { TrailerTable } from "@/components/tables/trailer-table";
import { PageTitle } from "@/components/ui/page-title";

export default function TrailersPage() {
    return (
        <>
            <PageTitle title="Trailers" />
            <TrailerTable />
        </>
    );
}
