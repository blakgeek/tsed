import {descriptorOf} from "../utils/objects/descriptorOf.js";

export function Configurable(value: boolean = true): Function {
  return (target: any, propertyKey: string) => {
    const descriptor = descriptorOf(target, propertyKey) || {writable: true, enumerable: true};
    descriptor.configurable = value;
    Object.defineProperty((target && target.prototype) || target, propertyKey, descriptor);

    return descriptor;
  };
}
