import { FilterQuery } from 'mongoose';
import { DatabaseModel } from '@/models';

export class Query<T = DatabaseModel> {
  protected ids: string[];
  protected fields: Record<string, string>;
  protected fieldsMultipleOr: Record<string, string[]> | null;

  constructor() {
    this.ids = [];
    this.fields = {};
    this.fieldsMultipleOr = null;
  }

  findByIds(ids: string[]) {
    this.ids = ids;
    return this;
  }

  findById(id: string) {
    return this.findByIds([id]);
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
      ...filterMultipleOr,
    };
    if (this.ids.length > 0) {
      filter._id = this.ids.length === 1 ? this.ids[0] : { '$in': this.ids };
    }
    return filter;
  }
}
