import { BaseRepository } from "@/lib/repositories/BaseRepository";

export interface Team {
    id: number;
    name: string;
}


class TeamRepository extends BaseRepository<Team> {

    constructor(table: string = "teams") {
        super(table);
    }

}

const teamRepository = new TeamRepository();
export default teamRepository;