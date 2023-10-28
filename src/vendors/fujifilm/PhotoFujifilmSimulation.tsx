/* eslint-disable max-len */
import { FujifilmSimulation, getLabelForFilmSimulation } from '@/vendors/fujifilm';

export default function PhotoFilmSimulation({
  simulation,
}: {
  simulation: FujifilmSimulation;
}) {
  const contentForSimulation = () => {
    switch (simulation) {
    default:
      return (
        <>
          <g clip-path="url(#clip0_256_511)">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M17.25 15H23.5C23.6381 15 23.75 14.8881 23.75 14.75V10.5144C23.75 10.4516 23.7737 10.391 23.8163 10.3448L26.6839 7.23849C26.7265 7.19231 26.7502 7.13177 26.7502 7.06892V3.25C26.7502 3.11193 26.6405 3 26.5024 3H17.2474C17.1094 3 17 3.11194 17 3.25001L17.0002 5.99999C17.0002 6.13806 16.8882 6.25 16.7502 6.25H15.7502C15.6121 6.25 15.5002 6.36192 15.5002 6.49999L15.5 11.5C15.5 11.6381 15.6119 11.75 15.75 11.75H16.75C16.8881 11.75 17 11.8619 17 12V14.75C17 14.8881 17.1119 15 17.25 15ZM19.75 4H18V5.5H19.75V4ZM18 12.5H19.75V14H18V12.5ZM22.75 4H21V5.5H22.75V4ZM21 12.5H22.75V14H21V12.5ZM25.75 4H24V5.5H25.75V4Z" fill="currentColor"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M5 2.99999L2.25 2.99999C2.11193 2.99999 2 3.11192 2 3.24999V4.74998C2 4.88806 2.11193 4.99998 2.25 4.99998H3.00001C3.13808 4.99998 3.25001 5.11191 3.25001 5.24999L3.25 12.75C3.25 12.8881 3.13807 13 3 13H2.25C2.11193 13 2 13.1119 2 13.25V14.75C2 14.8881 2.11193 15 2.25 15H14C14.1381 15 14.25 14.8881 14.25 14.75V13.25C14.25 13.1119 14.1381 13 14 13H13.25C13.1119 13 13 12.8881 13 12.75L13 5.25C13 5.11193 13.112 5 13.25 5H14C14.1381 5 14.25 4.88807 14.25 4.75V3.24999C14.25 3.11192 14.1381 2.99999 14 2.99999L11.25 2.99999C11.1119 2.99998 11 2.88806 11 2.74999V1.24998C11 1.11191 10.8881 0.999985 10.75 0.999985H5.5C5.36193 0.999985 5.25 1.11191 5.25 1.24998V2.74999C5.25 2.88806 5.13807 2.99998 5 2.99999ZM5.02318 4.8975L7.32943 12.75H9.21943L11.4807 4.8975H9.86068L8.62318 9.6675L8.37568 11.2875H8.19568L7.94818 9.6675L6.68818 4.8975H5.02318Z" fill="currentColor"/>
          </g>
          <defs>
            <clipPath id="clip0_256_511">
              <rect width="28" height="16" fill="currentColor"/>
            </clipPath>
          </defs>
        </>
      );
    }
  };
  
  return (
    <span
      title={getLabelForFilmSimulation(simulation)}
      className="text-dim"
    >
      <svg
        width="28"
        height="16"
        viewBox="0 0 28 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {contentForSimulation()}
      </svg>
    </span>
  );
}
