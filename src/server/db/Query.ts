import { FilterQuery } from 'mongoose';
import { DatabaseModel } from '@/models';

type FieldValue = string | number | boolean | null;
export abstract class Query<T = DatabaseModel> {
  protected ids: string[];
  protected fields: Record<string, FieldValue>;
  protected fieldsMultipleOr: Record<string, FieldValue[]> | null;
  protected emptyFields: string[];

  constructor() {
    this.ids = [];
    this.fields = {};
    this.fieldsMultipleOr = null;
    this.emptyFields = [];
  }

  findByIds(ids: string[]) {
    this.ids = ids;
    return this;
  }

  findById(id: string) {
    return this.findByIds([id]);
  }

  findBy(key: keyof T, value: FieldValue | FieldValue[]) {
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

  doesNotHave(key: keyof T) {
    this.emptyFields.push(key as string);
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
    const notExistFilter = this.emptyFields.reduce((currentFilter, key) => ({ ...currentFilter, [key]: { '$exists': false } }), {});
    let filter: FilterQuery<any> = {
      ...this.fields,
      ...filterMultipleOr,
      ...notExistFilter,
    };
    if (this.ids.length > 0) {
      filter._id = this.ids.length === 1 ? this.ids[0] : { '$in': this.ids };
    }
    return filter;
  }

  toMemorydbFilterQuery(): FilterQuery<any> {
    const filter = this.toMongooseFilterQuery();
    filter.id = filter._id;
    delete filter._id;
    return filter;
  }
}
