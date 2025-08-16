import { mysqlConnection } from "../config/database"
import axios from 'axios'

export interface VersionInfo {
    id: number;
    tag_name: string;
    prerelease: string;
    created_at: string;
    assets: {
        name: string;
        size: number;
        download_count: number;
        digest: string;
        browser_download_url: string;
    }[];
}

export interface GithubMirrorInfo {
    id: number;
    name: string;
    url: string;
    created_at: string;
}

// 适用于Github的Axios配置
export const githubAxiosConfig = {
    headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'WonderLab-Server'
    }
}

export const findAllGithubMirror = async () => {
    const [rows] = await mysqlConnection.query('SELECT * FROM github_mirror_info')
    return rows
}

export const findGithubMirrorById = async (id: number) => {
    const [rows] = await mysqlConnection.query('SELECT * FROM github_mirror_info WHERE id = ?', [id])
    return (rows as GithubMirrorInfo[])[0] || null
}

export const addGithubMirror = async (name: string, url: string) => {
    const [result] = await mysqlConnection.query('INSERT INTO github_mirror_info (name, url) VALUES (?, ?)', [name, url])
    return result
}

export const findVersionByMirror = async (mirrorId: number, page: number, pageSize: number) => {
    const mirror: any = await findGithubMirrorById(mirrorId);
    if (!mirror) {
        throw new Error('Mirror not found');
    }
    console.log('Mirror Info:', mirror);
    console.log('Mirror URL:', mirror.url);

    const axiosConfig = {
        ...githubAxiosConfig,
        baseURL: mirror.url,
        timeout: 15000,

        validateStatus: (status: any) => status >= 200 && status < 300,
    };

    let response: any;

    try {
        response = await axios.get(
            `/repos/Lunova-Studio/WonderLab.Override/releases`,
            {
                ...axiosConfig,
                params: {
                    page: page,
                    per_page: pageSize
                }
            }
        );
    } catch (error: any) {
        if (error.code === 'ERR_TIMEOUT') {
            throw new Error('Request Mirror Timeout');
        } else if (error.response) {
            throw new Error(`API Error: ${error.response.status} - ${error.response.data.message}`);
        } else {
            throw new Error(`Unknown Error: ${error.message}`);
        }
    }

    let versionList: VersionInfo[] = response.data.map((release: any) => ({
        id: release.id,
        tag_name: release.tag_name,
        prerelease: release.prerelease,
        created_at: release.created_at,
        assets: release.assets.map((asset: any) => ({
            name: asset.name,
            size: asset.size,
            download_count: asset.download_count,
            digest: asset.digest,
            browser_download_url: asset.browser_download_url,
        })),
    }));

    return versionList;
};
