import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Calendar } from "lucide-react"
import { CHANGELOG_DATA } from "@/constants/changelog"
type ChangeType = "new" | "improved" | "fixed"

interface Change {
    type: ChangeType
    text: string
}

interface ChangelogEntryProps {
    entry: {
        date: string
        title: string
        changes: Change[]
    }
}

function ChangelogEntry({ entry }: ChangelogEntryProps) {
    const getBadgeVariant = (type: ChangeType) => {
        switch (type) {
            case "new":
                return "default"
            case "improved":
                return "warning"
            case "fixed":
                return "success"
            default:
                return "default"
        }
    }

    const getBadgeLabel = (type: ChangeType) => {
        switch (type) {
            case "new":
                return "Nuevo"
            case "improved":
                return "Mejorado"
            case "fixed":
                return "Corregido"
            default:
                return type
        }// Datos de ejemplo para el changelog organizado por fechas

    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Calendar className="h-4 w-4" />
                    {entry.date}
                </div>
                <CardTitle className="text-xl">{entry.title}</CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="space-y-4">
                    {entry.changes.map((change, index) => (
                        <li key={index} className="flex items-start gap-3">
                            <Badge variant={getBadgeVariant(change.type)} className="mt-0.5">
                                {getBadgeLabel(change.type)}
                            </Badge>
                            <span>{change.text}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>
            <Separator />
        </Card>
    )
}




export function Changelog() {
    return (
        <div className="space-y-8">
            {CHANGELOG_DATA.map((entry, index) => (
                <ChangelogEntry key={index} entry={entry} />
            ))}
        </div>
    )
}
