import { FilterQuery } from 'mongoose';
import { DatabaseModel } from '@/models';

export class Query<T = DatabaseModel> {
  protected id: string | null;
  protected fields: Record<string, string>;
  protected fieldsMultipleOr: Record<string, string[]> | null;

  constructor() {
    this.id = null;
    this.fields = {};
    this.fieldsMultipleOr = null;
  }

  findById(id: string) {
    this.id = id;
    return this;
  }

  findBy(key: keyof T, value: string | string[]) {
    if (Array.isArray(value)) {
      if (!this.fieldsMultipleOr) {
        this.fieldsMultipleOr = {};
      }
      this.fieldsMultipleOr[key as string] = value;
    } else {
      this.fields[key as string] = value;
    }
    return this;
  }

  toMongooseFilterQuery(): FilterQuery<any> {
    const filterMultipleOr = this.fieldsMultipleOr &&
      Object.entries(this.fieldsMultipleOr).reduce((currentFilter, [key, value]) => {
        return {
          ...currentFilter,
          [key]: { '$in': value }
        };
      }, {});
    let filter: FilterQuery<any> = {
      ...this.fields,
      ...filterMultipleOr
    };
    if (this.id) {
      filter._id = this.id;
    }
    return filter;
  }
}
