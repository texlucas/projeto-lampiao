import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { IoMdMegaphone } from "react-icons/io";

interface DenunciaProps {
  tipo: string
  descricao: string
  data: string
  status: "Pendente" | "Em Análise" | "Resolvida"
}

export default function DenunciaCard({
  tipo,
  descricao,
  data,
  status,
}: DenunciaProps) {
  return (
    <Card className="w-full border border-gray-200 shadow-sm">
      <CardContent className="flex items-center gap-4">

        <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center">
          <IoMdMegaphone className="w-6 h-6 text-purple-700" />
        </div>

        <div className="flex-1 flex flex-col">
          <h3 className="font-semibold text-lg">{tipo}</h3>

          <p className="text-sm text-gray-600">
            {descricao}
          </p>

          <p className="text-xs text-gray-400 mt-1">
            Denúncia feita em: {data}
          </p>

          <Badge
            variant="secondary"
            className="w-fit mt-2 bg-green-100 text-green-600"
          >
            {status}
          </Badge>
        </div>

      </CardContent>
    </Card>
  )
}
