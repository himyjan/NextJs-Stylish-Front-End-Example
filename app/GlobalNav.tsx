'use client';

import clsx from 'clsx';
import { useSelectedLayoutSegments } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import Header from '../ui/Header/Header';
import Footer from '../ui/Footer/Footer';

export default function GlobalNav() {
  return (
    <>
      <Suspense>
        <Header />
      </Suspense>
      <Footer />
    </>
  );
}
