import { paginationFunction } from "./pagination.js";

export class ApiFeature {
	constructor(mongooseQuery, queryData) {
		this.mongooseQuery = mongooseQuery;
		this.queryData = queryData;
	}

	//pagination

	pagination() {
		const { page, size } = this.queryData;

		const { limit, skip } = paginationFunction({ page, size });

		this.mongooseQuery.limit(limit).skip(skip);
		return this;
	}

	// sort
	sort() {
		this.mongooseQuery.sort(this.queryData.sort?.replaceAll(",", " "));
		return this;
	}

	// select

	select() {
		this.mongooseQuery.select(this.queryData.select?.replaceAll(",", " "));
		return this;
	}

	// filters

	filters() {
		const filterObject = { ...this.queryData };
		for (const key in filterObject) {
			if (key.match(/sort|select|page|size|search|title/)) {
				delete filterObject[key];
			}
		}
		const filterString = JSON.parse(
			JSON.stringify(filterObject).replaceAll(
				/gt|gte|lt|lte|in|nin|eq|neq|regex/g,
				(match) => `$${match}`
			)
		);

                this.mongooseQuery.find(filterString)
                return this
	}
}
