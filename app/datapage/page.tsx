import NavMenu from "@/components/NavMenu";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DocumentRecord {
  name: string;
  status: number;
  state: "Completed" | "Manual Review" | "Pending";
  model: string;
  fields: string[];
}

const documents: DocumentRecord[] = [
  {
    name: "Document1.pdf",
    status: 100,
    state: "Completed",
    model: "Finance Model",
    fields: [
      "Dataaewoifnaweofiawoeifjaweofijaweofijafweo asflkawefi awoifj aoweifjaowiejfaoiwejf aowiefj awoefij awoijj",
      "Datawefoiawefoiawefoijawefa",
      "Daawefoiawefoijawefoijawefoijawefoijaweofijafweta",
      "Dataoiwefjaoweifjaoweifja",
    ],
  },
  {
    name: "Document2.pdf",
    status: 85,
    state: "Manual Review",
    model: "Finance Model",
    fields: ["Data", "Data", "Data", "Data"],
  },
  {
    name: "Document3.pdf",
    status: 76,
    state: "Pending",
    model: "Finance Model",
    fields: ["Data", "Data", "Data", "Data"],
  },
  {
    name: "Document4.pdf",
    status: 45,
    state: "Pending",
    model: "Finance Model",
    fields: ["Data", "Data", "Data", "Data"],
  },
  {
    name: "Document5.pdf",
    status: 37,
    state: "Pending",
    model: "Finance Model",
    fields: ["Data", "Data", "Data", "Data"],
  },
  {
    name: "Document6.pdf",
    status: 60,
    state: "Pending",
    model: "Finance Model",
    fields: ["Data", "Data", "Data", "Data"],
  },
  {
    name: "Document7.pdf",
    status: 80,
    state: "Pending",
    model: "Finance Model",
    fields: ["Data", "Data", "Data", "Data"],
  },
];

const stateStyles: Record<DocumentRecord["state"], string> = {
  Completed: "bg-green-500 text-white hover:bg-green-500",
  "Manual Review": "bg-orange-400 text-white hover:bg-orange-400",
  Pending: "bg-yellow-300 text-gray-800 hover:bg-yellow-300",
};

const stateBorderStyles: Record<DocumentRecord["state"], string> = {
  Completed: "border-green-500",
  "Manual Review": "border-orange-400",
  Pending: "border-yellow-300",
};

function getStatusColor(status: number) {
  if (status >= 90) return "bg-green-500";
  if (status >= 70) return "bg-lime-400";
  if (status >= 50) return "bg-yellow-300";
  return "bg-gray-300";
}

const FIELD_COLUMN_WIDTH = "w-[220px] min-w-[220px] max-w-[220px]";

export default function Datapage() {
  return (
    <div className="relative flex min-h-screen flex-col bg-gray-50">
      <header className="fixed inset-x-0 top-0 z-10 flex items-center justify-between bg-white px-4 py-3 shadow-sm sm:px-6 lg:px-8">
        <div className="text-lg font-bold text-gray-900">svg here</div>
        <NavMenu />
      </header>

      <main className="mx-auto flex w-full max-w-7xl flex-1 px-4 pt-24 pb-12 sm:px-6 lg:px-8">
        <div className="w-full">
          <Card className="overflow-hidden border bg-white shadow-sm">
            <Table className="w-full">
              <TableHeader className="bg-gray-100">
                <TableRow className="hover:bg-gray-100">
                  <TableHead className="text-gray-600">Document Name</TableHead>
                  <TableHead className="text-gray-600">OCR Status</TableHead>
                  <TableHead className="text-gray-600">OCR State</TableHead>
                  <TableHead className="text-gray-600">OCR Model</TableHead>
                  <TableHead className={`text-gray-600 ${FIELD_COLUMN_WIDTH}`}>
                    Field 1
                  </TableHead>
                  <TableHead className={`text-gray-600 ${FIELD_COLUMN_WIDTH}`}>
                    Field 2
                  </TableHead>
                  <TableHead className={`text-gray-600 ${FIELD_COLUMN_WIDTH}`}>
                    Field 3
                  </TableHead>
                  <TableHead className={`text-gray-600 ${FIELD_COLUMN_WIDTH}`}>
                    Field 4
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((document) => (
                  <TableRow
                    key={document.name}
                    className="bg-white hover:bg-transparent"
                  >
                    <TableCell className="text-sm text-gray-700">
                      {document.name}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold text-gray-600">
                          {document.status}%
                        </span>
                        <div className="relative h-4 w-32 overflow-hidden rounded-full bg-gray-200">
                          <div
                            className={`h-full ${getStatusColor(document.status)} transition-all`}
                            style={{ width: `${document.status}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`border ${stateBorderStyles[document.state]} ${stateStyles[document.state]}`}
                      >
                        {document.state}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-700">
                      {document.model}
                    </TableCell>
                    {document.fields.map((field, index) => (
                      <TableCell
                        key={`${document.name}-field-${index}`}
                        className={`text-sm text-gray-500 ${FIELD_COLUMN_WIDTH} truncate`}
                        title={field}
                      >
                        {field}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </main>
    </div>
  );
}
