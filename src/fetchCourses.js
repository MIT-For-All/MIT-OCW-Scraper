const scrape = require('scrape-it')

const allCoursesUrl = 'https://ocw.mit.edu/courses/'
const newCoursesUrl = 'https://ocw.mit.edu/courses/new-courses/'
const lectureCoursesUrl = 'https://ocw.mit.edu/courses/audio-video-courses/'
const onlineTextbooksUrl = 'https://ocw.mit.edu/courses/online-textbooks/'
const mostVisetedCoursesUrl = 'https://ocw.mit.edu/courses/most-visited-courses/'
const ocwScholarCoursesUrl = 'https://ocw.mit.edu/courses/ocw-scholar/'

const fetchCourses = url => (
	async () => {
		const { departments, courseList } = await scrape(url, {
			departments: {
				listItem: '.deptTitle a'
			},
			courseList: {
				listItem: '.courseList',
				data: {
					departmentCourses: {
						listItem: '.odd, .even',
						data: {
							url: {
								selector: 'a',
								attr: 'href'
							},
							courseNumber: {
								selector: 'a',
								eq: 0
							},
							courseName: {
								selector: 'a',
								eq: 1
							},
							courseLevel: {
								selector: 'a',
								eq: 2
							}
						}
					}
				}
			}
		})
		let courses
		if (url === mostVisetedCoursesUrl) {
			courses = courseList[0].departmentCourses
		} else {
			courses = departments.map((d, i) => ({
				department: d,
				courses: courseList[i].departmentCourses
			}))
		}
		return courses
	}
)

const fetchAllCourses = fetchCourses(allCoursesUrl)

const fetchNewCourses = fetchCourses(newCoursesUrl)

const fetchLectureCourses = fetchCourses(lectureCoursesUrl)

const fetchOnlineTextbooks = fetchCourses(onlineTextbooksUrl)

const fetchMostVisetedCourses = fetchCourses(mostVisetedCoursesUrl)

const fetchOCWScholarCourses = async () => {
	const { courses } = await scrape(ocwScholarCoursesUrl, {
		courses: {
			listItem: '.scmod',
			data: {
				url: {
					selector: 'a',
					attr: 'href',
					eq: 0
				},
				courseName: {
					selector: 'a',
					eq: 1
				}
			}
		}
	})

	return courses
}

module.exports = { fetchAllCourses,
	fetchNewCourses,
	fetchLectureCourses,
	fetchOnlineTextbooks,
	fetchMostVisetedCourses,
	fetchOCWScholarCourses }
