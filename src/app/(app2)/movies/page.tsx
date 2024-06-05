'use client';
import { useState, useRef, useEffect } from 'react';
import movieQuote from 'popular-movie-quotes';
import Typewriter from 'typewriter-effect';
import localFont from 'next/font/local';
import clsx from 'clsx';
// import WbSunnyIcon from '@mui/icons-material/WbSunny';
// import DarkModeIcon from '@mui/icons-material/DarkMode';

// Font files can be colocated inside of `pages`
const myFont = localFont({ src: '../../../../public/fonts/Maximilian.ttf' });
export default function page() {
	const [isLandscape, setIsLandscape] = useState(true);
	const [quote, setQuote] = useState('');
	const [movie, setMovie] = useState('');
	const [year, setYear] = useState('');
	const [isPosterShow, setIsPosterShow] = useState(true);
	const [url, setUrl] = useState('');
	const ref = useRef('');
	const getPost = (data: any) => {
		const box = document.querySelector('.box');
		fetch(
			`https://api.themoviedb.org/3/search/movie?query=${data.movie}&include_adult=true&language=en-US&page=1&year=${data.year}`,
			{
				method: 'GET',
				headers: {
					accept: 'application/json',
					Authorization:
						'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhZTMzZWI4ODlmMWI1NDBiNWNhOTM3ZjU5ODc1MmRkNiIsInN1YiI6IjY0NWVmN2QxYTY3MjU0MDE4NTg3MzE5OSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.d057dYNT2zbp_e-IEFBIEGTkLAbiyjH9iNnIW1py8Ag',
				},
			},
		)
			.then((response) => response.json())
			.then((response) => {
				let backdrop_path = response.results[0]?.backdrop_path;
				let poster_path = response.results[0]?.poster_path;
				if (backdrop_path) {
					let poster_link = isLandscape
						? `https://image.tmdb.org/t/p/original${backdrop_path}`
						: `https://image.tmdb.org/t/p/original${poster_path}`;
					box.style.transition = 'opacity 1s';
					box.style.opacity = 0;
					setTimeout(() => {
						box.style.backgroundImage = `url(${poster_link})`;
						box.style.opacity = 1;
					}, 1000);
				} else {
					box.style.backgroundImage = `url('')`;
				}
			})
			.catch((err) => {
				console.error(err);
				box.style.backgroundImage = `url('')`;
			});
	};
	const handleClick = () => {
		//get movie quote
		const data = movieQuote.getSomeRandom(1)[0];
		setQuote(data.quote);
		setMovie(data.movie);
		setYear(data.year);
		ref.current = data;
		//get movie post by quote info
		if (!isPosterShow) return;
		getPost(data);
	};

	//switch black mode or post mode
	const onSwitch = (e: any) => {
		e.stopPropagation();
		setIsPosterShow((current) => !current);
	};
	const checkScreenOrientation = () => {
		if (typeof window !== 'undefined') {
			setIsLandscape(window.innerWidth > window.innerHeight);
		}
	};
	useEffect(() => {
		if (isPosterShow) {
			getPost(ref.current);
		}
	}, [isPosterShow]);

	useEffect(() => {
		// Initial check
		checkScreenOrientation();

		// Event listener for window resize
		window.addEventListener('resize', checkScreenOrientation);

		// Cleanup event listener on component unmount
		return () => {
			window.removeEventListener('resize', checkScreenOrientation);
		};
	}, []);
	const styled = {
		boxShadow: `rgba(0, 0, 0, 0.25) 0px 54px 55px, 
					rgba(0, 0, 0, 0.12) 0px -12px 30px,
		 			rgba(0, 0, 0, 0.12) 0px 4px 6px, 
		 			rgba(0, 0, 0, 0.17) 0px 12px 13px, 
		 			rgba(0, 0, 0, 0.09) 0px -3px 5px`,
	};
	return (
		<div className="h-screen w-screen bg-black fixed inset-0 z-999">
			{isPosterShow && (
				<div className="box h-full w-full bg-center bg-contain absolute top-0 bg-no-repeat z-10" />
			)}
			<div
				className={
					'w-full h-full flex items-center justify-center absolute bg-transparent top-0 z-20'
				}
				onClick={handleClick}
			>
				<div className="absolute top-4 right-0">
					<label className="swap swap-flip  text-[4rem] leading-[1]">
						{/* this hidden checkbox controls the state */}
						<input type="checkbox" className="hidden" />
						<div className="swap-on" onClick={onSwitch}>
							⚪
						</div>
						<div className="swap-off" onClick={onSwitch}>
							📽️
						</div>
					</label>
				</div>
				<div
					className="text-3xl font-bold text-rose-50 p-12 max-w-[600px] bg-[rgba(0,0,0,0.5)]"
					style={{ boxShadow: styled.boxShadow }}
				>
					<Typewriter
						onInit={(typewriter) => {
							// typewriter.changeDelay(0.000001).start();
						}}
						options={{
							strings: quote
								? `<span>${quote}</span>
						</br></br>
						<span style="font-size:16px;margin-left:20px">---《${movie}》  ${year}</span>`
								: 'CLICK THE SCREEN FOR MORE',
							autoStart: true,
							loop: false,
							deleteSpeed: 0,
							delay: 80,
						}}
					/>
				</div>
				<div
					className={clsx(
						myFont.className,
						'text-white absolute bottom-6 text-[30px]',
					)}
				>
					Javier Kanagawa
				</div>
			</div>
		</div>
	);
}
