import { Matches, ValidationOptions } from "class-validator";

export function IsFptEmail(ValidationOptions?: ValidationOptions) {
    return Matches(
        /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
        { ...ValidationOptions }
    )
}