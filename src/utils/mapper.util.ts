import {
	type ClassConstructor,
	instanceToPlain,
	plainToInstance,
} from "class-transformer";

export default class Mapper {
	toClass<T, V>(cls: ClassConstructor<T>, plain: V): T {
		return plainToInstance(cls, plain);
	}

	toPlain<T>(instace: T): object {
		return instanceToPlain(instace);
	}

	clone<T>(instance: T, cls?: ClassConstructor<T>): T {
		const classConstructor =
			cls ?? ((instance as object).constructor as ClassConstructor<T>);
		return plainToInstance(classConstructor, instanceToPlain(instance));
	}
}
