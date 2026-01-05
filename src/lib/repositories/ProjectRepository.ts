import { BaseRepository } from "@/lib/repositories/BaseRepository";

export interface Project {
    id: number;
    name: string;
}


class ProjectRepository extends BaseRepository<Project> {

    constructor(table: string = "projects") {
        super(table);
    }

}

const projectRepository = new ProjectRepository();
export default projectRepository;