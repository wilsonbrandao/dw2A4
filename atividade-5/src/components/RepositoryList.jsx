import { Counter } from "./Counter"
import { RepositoryItem } from "./RepositoryItem"

const repository = {
    name: "Atividade",
    description: "Descrição da Atividade",
    link: "https://github.com/wilsonbrandao"
}

export function RepositoryList() {
    return (
        <>
            < RepositoryItem repository={repository} />
            < Counter />
        </>
    )
}